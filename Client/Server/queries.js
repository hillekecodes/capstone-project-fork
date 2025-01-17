const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;
const pool = new Pool({
    host: 'localhost',
    user: 'ec',
    database: 'capstone',
    port: 5432
});

  const createUser = async (req, res) => {
    try{
      const { email, username, password, zip } = req.body
      let hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query('INSERT INTO users (email, username, password, zip) VALUES ($1, $2, $3, $4) RETURNING *', 
                [email, username, hashedPassword, zip])
      res.json(newUser)  
      }catch (err) {
        console.log(err)
    }
  }

  const loginUser = (req, res) => {
    const { username, password} = req.body
    console.log(username, password)
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        res.send({ error: error })
      }
      console.log(results.rows[0])
      if (results.rows.length > 0) {
        bcrypt.compare(password, results.rows[0].password, (error, response) => {
            if (response) {
              res.send(response);
            } else {
              res.send({ message: "Invalid Credentials" });
            }
        });
      } else {
        res.send({ message: "Credentials not found" });
      }
    })
  }

  const filterPosts = (req, res) => {
      const { category } = req.params;
      pool.query('SELECT * FROM posts WHERE category = $1', [category], (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
    }



  const getPosts = (req, res) => {
    pool.query('SELECT * FROM posts ORDER BY id DESC', (error, results) => {
      if (error) {
        throw error
      }
      const allPosts = res.status(200).json(results.rows);
      return allPosts
    })
  }

  const getItem = (req, res) => {
    const id = parseInt(req.params)
    pool.query('SELECT * FROM posts WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

  const updateItem = (req, res) => {
    const id = parseInt(req.params.id)
    const { item, store, total, description, address, city, state, zip, images, category } = req.body
    pool.query(
      'UPDATE posts SET item = $1, store = $2, total = $3, description = $4, address = $5, city = $6, state = $7, zip = $8, images = $9, category = $10 WHERE id = $11',
      [item, store, total, description, address, city, state, zip, images, category, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`Item modified with ID: ${id}`)
      }
    )
  }

  // const updateItem = (req, res) => {
  //   const id = parseInt(req.params.id)
  //   const { item, store, total, description, address, city, state, zip, images, category } = req.body
  //   pool.query(
  //     'UPDATE posts SET item = $1, store = $2, total = $3, description = $4, address = $5, city = $6, state = $7, zip = $8, images = $9, category = $10, WHERE = $11',
  //     [item, store, total, description, address, city, state, zip, images, category, id],
  //     (error, results) => {
  //       if (error) {
  //         throw error
  //       }
  //       res.status(200).send(`Item modified with ID: ${id}`)
  //     }
  //   )
  // }
  
  const deleteItem = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM posts WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Item deleted with ID: ${id}`)
      console.log(results)
    })
  }

  const createItem = async (req, res) => {
    try {
      console.log('formData');
      console.log(req.body)
      console.log(req.files)
      let img = req.files['file-0'].data.toString('base64');
      let imgType = req.files['file-0'].mimetype;
      const { item, store, total, user_link, description, address, city, state, zip, images, category, imageformat } = req.body
      const newUser = await pool.query('INSERT INTO posts (item, store, total, user_link, description, address, city, state, zip, images, imageformat, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', 
                [item, store, total, user_link, description, address, city, state, zip, img, imgType, category])
      res.json(newUser)  
      }catch (err) {
        console.log(err)
    }
  }


  // const filterPosts = (req, res) => {
  //   const { category } = req.params;
  //   pool.query('SELECT * FROM posts WHERE category = $1', [category], (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     res.status(200).json(results.rows)
  //   })
  // }

  module.exports = {
    createUser,
    filterPosts,
    getPosts,
    getItem,
    updateItem,
    deleteItem,
    createItem,
    // filterPosts,
    // getFavorites,
    loginUser
    // authUser
  }