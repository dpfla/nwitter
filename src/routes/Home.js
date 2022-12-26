import { dbService } from "fBase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
    
    useEffect(() => {
        const nweetsQuery = query(collection(dbService, "nweets"));
        onSnapshot(nweetsQuery, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data()
            }));
            setNweets(nweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
                text: nweet,
                createdAt: Date.now(),
                creatorId:userObj.uid,
            });
            setNweet("");
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
                    <h4>{nweet.text}</h4>
                </div>)}
            </div>
        </div>
    );
};
export default Home;