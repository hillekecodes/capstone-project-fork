import Home from "./Components/Home";
import Register from "./Components/Register";
import PostItem from "./Components/PostItem";
import UploadPage from "./Components/UploadPage";
import Help from "./Components/Help";
import { Routes, Route, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { L36 } from "react-isloading";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

/* Top Spinners for Loading
L36 yellowbook
L57 green search - user, folder, glass
L74 red/white magifying glass on file
L96 blue/white/red shopping bag
*/

const App = () => {
  const initialUserData = {
    username: "",
    password: "",
    email: "",
    name: "",
    city: "",
    state: "",
    zip: "",
  };

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [item, setItem] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [category, setCategory] = useState([]);
  const [shouldReload, setShouldReload] = useState(false);
  const [user, setUser] = useState(initialUserData)
  const [search, setSearch] = useState('')
  let { id } = useParams();


  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
        setShouldReload(false);
      });
  }, [shouldReload]);

  useEffect(() => {
    if (category) {
      const post = posts.filter((post) => post.category === category);
      // console.log(post);
      setFilteredPosts(post);
    } else {
      setFilteredPosts(posts);
    }
  }, [category]);

  useEffect(() => {
    if (search && search.length > 3) {
      const searchedPosts = posts.filter((post) => {
        console.log('postitem', post.item)
        if (post.item.includes(search) || post.category.includes(search)) {
          return post
        }
      });
      setFilteredPosts(searchedPosts);
    } else {
      setFilteredPosts(posts);
    }
  }, [search]);

  // useEffect(() => {
  //   console.log(search)
  //   if (!search) {
  //     setFilteredPosts(posts)
  //     return
  //   } 
  //   const newPosts = posts.filter((post) => {
  //     console.log('search', typeof(search))
  //     if (
  //       post.item.includes(search) ||
  //       post.category.includes(search)
  //     ) {
  //       return post;
  //     } 
  //   })
  //   setFilteredPosts(newPosts)  
  // }, [search]);

  return (
    <>
      {loading ? (
        <L36
          style={{
            height: "75vh",
            width: "75vw",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  posts={filteredPosts}
                  setPosts={setPosts}
                  setItem={setItem}
                  setCategory={setCategory}
                  setSearch={setSearch}
                  search={search}
                />
              }
            />
            <Route path="/help" element={<Help />} />
            <Route path="register" element={<Register user={user} setUser={setUser} />} />
            <Route
              path="/upload"
              element={
                <UploadPage
                  setCategory={setCategory}
                  setShouldReload={setShouldReload}
                />
              }
            />
            <Route
              path="item/:id"
              element={
                <PostItem
                  item={item}
                  setItem={setItem}
                  setShouldReload={setShouldReload}
               
                />
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
};
export default App;
