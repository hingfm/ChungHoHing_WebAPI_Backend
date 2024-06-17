import * as db from '../helpers/database';

export const getAll = async  (limit=10, page=1) =>{
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM users LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
}

export const getSearch = async  (sfield:any,q:any) =>{
 const query = `SELECT ${sfield} FROM users WHERE ${sfield} LIKE '%${q}%' `;
 try{ const data = await db.run_query(query,null);
  return data;}
  catch(error) {
    return error
}
}

export const getByUserId = async  (id:number) =>{
  let query = "SELECT * FROM users WHERE id = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

  export const add = async  (user:any) =>{  
  let keys= Object.keys(user)
  let values= Object.values(user)  
  let key = keys.join(',')   
  let parm = ''
  for(let i =0; i<values.length; i++){ parm +='?,'}
  parm=parm.slice(0,-1)
  let query = `INSERT INTO users (${key}) VALUES (${parm})`
  try{
    await db.run_query(query, values)  
    return {"status": 201}
  } catch(error) {
    return error
  }
}

export const findOrCreateGoogleUser = async (
  googleId: string,
  email: string,
  name: string
) => {
  console.log(`Attempting to find or create Google user: ${email}`);
  let query = "SELECT * FROM users WHERE google_id = ?";
  let users = await db.run_query(query, [googleId]);
  console.log(`User lookup result: ${users.length} found`);

  if (users.length === 0) {
    console.log(`No user found with Google ID ${googleId}, creating new user.`);
    let newUser = {
      google_id: googleId,
      email: email,
      username: name, // Assuming using email as the username
      role: 'user',
      dateregistered: new Date(),
    };

    let keys = Object.keys(newUser).join(',');
    let values = Object.values(newUser);
    let placeholders = values.map(() => '?').join(',');
    query = `INSERT INTO users (${keys}) VALUES (${placeholders})`;
    try {
      const result = await db.run_query(query, values);
      console.log("New user created successfully");
      return newUser;
    } catch (error) {
      console.error("Failed to create new user:", error);
      return undefined;
    }
  }
  console.log("User found, no need to create a new one.");
  return users[0];
};

export const findByUsername = async (username: string) => {
  const query = 'SELECT * FROM users where username = ?';
  const user = await db.run_query(query,  [username] );
  return user;
}

export const  update= async(user:any,id:any)  =>{  

  //console.log("user " , user)
 // console.log("id ",id)
  let keys = Object.keys(user)
  let values = Object.values(user)  
  let updateString=""
  for(let i: number = 0; i<values.length;i++){updateString+=keys[i]+"="+"'"+values[i]+"'"+"," }
 updateString= updateString.slice(0, -1)
 // console.log("updateString ", updateString)
  let query = `UPDATE users SET ${updateString} WHERE ID=${id} RETURNING *;`
  try{
   await db.run_query(query, values)  
    return {"status": 201}
  } catch(error) {
    return error
  }
}

export const deleteById = async (id:any) => {
  let query = "Delete FROM users WHERE ID = ?"
  let values = [id]
  try{
    await db.run_query(query, values);  
    return { "affectedRows":1 }
  } catch(error) {
    return error
  }
}
