import { type Insertable, type Kysely, Transaction, Updateable } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { ListSchema } from "./schemas/list.schema";

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: Insertable<Objectives>) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function edit(db: Kysely<DB> | Transaction<DB>, todo: Updateable<Objectives>, id: string) {
    return db
        .updateTable("objectives")
        .set({
            ...todo,
            updatedAt: new Date()
        })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();
}

export async function getList(db: Kysely<DB>, filter: ListSchema) {
    let query = db.selectFrom("objectives").selectAll();

    if (filter.search) {
        query = query.where("title", "ilike", `%${filter.search}%`);
    }

    if (filter.isCompleted !== undefined) {
        query = query.where("isCompleted", "=", filter.isCompleted);
    }
    query = query
        .orderBy(filter.sortBy ?? "createdAt", filter.sortOrder)
        .limit(filter.limit as number)
        .offset(filter.offset as number);

    return await query.execute();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}
