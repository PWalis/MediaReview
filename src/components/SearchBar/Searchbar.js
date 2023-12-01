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
          setSearchResults(<div className="text-red-500 absolute top-8 right-1">{data.message}</div>);
          setTimeout(() => {
            setSearchResults(null)
          }, 2000)
          return;
        }
        setSearchResults(createList(data));
        setTimeout(() => {
          setSearchResults(null)
        }, 6000)
      });
  };

  const onChangeHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const createList = (data) => {
    return (
      <div className=" bg-frenchgray w-full z-50">
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
      <form id="searchBarForm" className="absolute top-0 right-1" onSubmit={onSubmitHandler}>
        <input
          id="searchBarInput"
          value={searchInput}
          placeholder="Search user"
          onChange={onChangeHandler}
          className="rounded-xl border-0 bg-whitesmoke h-8 focus:outline-none "
        ></input>
        <button id="searchBarSubmitButton" type="submit">
        </button>
        {searchResults}
      </form>
    </>
  );
};

export default SearchBar;
