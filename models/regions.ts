import * as db from '../helpers/database';


export const getAll = async () => {
    const query = "SELECT * FROM regions"
    const data = await db.run_query(query, [])
    return data
}

