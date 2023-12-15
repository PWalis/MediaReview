import React from "react";

const DraftList = ({ drafts, handleOnClick }) => {
  const draftList = drafts.map((draft) => {
    return (
      <div
        key={draft._id}
        className="relative shadow-md shadow-slate-600 bg-frenchgray p-3 rounded-md mb-4 overflow-hidden max-h-24"
      >
        <h1 className="mb-1">{draft.title}</h1>
        <h2 className="absolute top-3 right-5">{draft.rating}/10</h2>
        <div dangerouslySetInnerHTML={{ __html: draft.content }} />
        <button
          className="  bg-amber-500/90 rounded-lg p-1 absolute bottom-1 right-1 shadow-slate-700 shadow-md"
          onClick={() => handleOnClick(draft)}
        >
          {" "}
          Load Draft
        </button>
      </div>
    );
  });

  return <div>{draftList}</div>;
};

export default DraftList;
