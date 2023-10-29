import react, { useState } from "react";
import UserAsListItem from "../UI/UserAsListItem";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState();

  const onSubmitHandler = (event) => {
    event.preventDefault();

    fetch("/SearchUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: searchInput,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message) {
          setSearchResults(<div>{data.message}</div>);
          setTimeout(() => {
            setSearchResults(null)
          }, 2000)
          return;
        }
        setSearchResults(createList(data));
      });
  };

  const onChangeHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const createList = (data) => {
    return (
      <div className=" bg-red-300 w-full">
        <UserAsListItem
          signedUrl={data.profilePic}
          username={data.username}
          userID={data.userID}
        ></UserAsListItem>
      </div>
    );
  };

  return (
    <>
      <form id="searchBarForm" onSubmit={onSubmitHandler}>
        <input
          id="searchBarInput"
          value={searchInput}
          onChange={onChangeHandler}
        ></input>
        <button id="searchBarSubmitButton" type="submit">
          Search
        </button>
        {searchResults}
      </form>
    </>
  );
};

export default SearchBar;
