import React from 'react'
import "../styles/searchbar.css";

const Searchbar = ({pageToGo, ButtonText, onSearchChange, searchValue}) => {

  return (
    <div className="page-header">
        <div>
          <input type="text" placeholder="🔍 Procurar" className="input-search"  value={searchValue} onChange={(e) => onSearchChange(e.target.value)}/>
          <button onClick={pageToGo} className="botao-create">{ButtonText}</button> 
        </div>
      </div>
  );
}

export default Searchbar