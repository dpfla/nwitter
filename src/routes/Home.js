import { dbService } from "fBase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = () => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
    const getNweets = async() => {
        const nweetsQuery = query(collection(dbService, "nweets"));
        const querySnapshot = await getDocs(nweetsQuery);
        querySnapshot.forEach((doc) => {
            const nweetObj = {
                ...doc.data(),
                id: doc.id
            }
            setNweets(prev => [nweetObj, ...prev]);
        });
    }
    useEffect(() => {
        getNweets();
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
              nweet,
              createdAt: Date.now(),
            });
            setNweet("");
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const onChange = (event) => {
        const { target: {value} } = event;
        setNweet(value);
    };

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    value={nweet} 
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120}
                    onChange={onChange}
                />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map(nweet => 
                <div key={nweet.id}>
                    <h4>{nweet.nweet}</h4>
                </div>)}
            </div>
        </div>
    );
};
export default Home;