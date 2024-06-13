import * as db from '../helpers/database';


export const getAll = async () => {
    const query = "SELECT * FROM kinds"
    const data = await db.run_query(query, [])
    return data
}

