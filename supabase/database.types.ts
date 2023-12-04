// import { PostgrestError, QueryResult } from "@supabase/supabase-js";
// import { Database } from "./database-generated.types";

// export type TableRows<T extends keyof Database["public"]["Tables"]> =
//   Database["public"]["Tables"][T]["Row"];
// export type TableInserts<T extends keyof Database["public"]["Tables"]> =
//   Database["public"]["Tables"][T]["Insert"];

// export type Views<T extends keyof Database["public"]["Views"]> =
//   Database["public"]["Views"][T]["Row"];

// export type Enums<T extends keyof Database["public"]["Enums"]> =
//   Database["public"]["Enums"][T];

// export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
// export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
//   ? Exclude<U, null>
//   : never;
// export type DbResultErr = PostgrestError;