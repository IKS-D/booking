export function getBrowsedFiles(): FileList {
    return fileListFromArray([
        mockFileCreator({ name: 'file-one.png', type: 'image/png', size: 234 * 1000 }),
        mockFileCreator({ name: 'file-two.gif', type: 'image/gif', size: 56 * 1000 }),
    ]);
}

export function mockFileCreator({
    name = 'file.txt',
    size = 1024,
    type = 'plain/txt',
    lastModified = new Date(),
}: {
    name?: string;
    size?: number;
    type?: string;
    lastModified?: Date;
}): File {
    const blob = new Blob(['a'.repeat(size)], { type });
    return new File([blob], name, { type, lastModified: lastModified.getTime() });
}

function fileListFromArray(files: File[]): FileList {
    const fileList: { 
        length: number; 
        item(index: number): File | null; 
        [index: number]: File; // Proper index signature declaration
        [Symbol.iterator](): Iterator<File>; 
    } = {
        length: files.length,
        item(index: number) {
            return files[index] || null;
        },
        [Symbol.iterator]() {
            let index = 0;
            return {
                next: () => {
                    if (index < files.length) {
                        return { value: files[index++], done: false };
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
        }
    };

    // Populate the fileList with index-based access to the files
    for (let i = 0; i < files.length; i++) {
        fileList[i] = files[i];
    }

    return fileList as FileList;
}
