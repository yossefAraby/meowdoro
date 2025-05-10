import React from 'react';

function Header(props){
    const logo = <img src="6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" alt="logo"/>
  return(
    <div className="header">
        {logo}
      <h3>Meoudoro</h3>
    </div>
  )
}

export default Header;