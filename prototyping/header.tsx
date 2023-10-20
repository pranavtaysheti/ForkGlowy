import { useState, useId } from "react";

function FilterTodo() {
  const [text, setText] = useState("");
  <input className={"form-control me-2"} type="search" placeholder="Search" aria-label="Search" />

  //TODO: Add actual functionality
}

function NavBar() {
  return (
    <nav className={"navbar navbar-expand-lg bg-body-tertiary"}>
      <div className={"container fluid"}>
        <p className={"navbar-brand"}> ForkGlowy </p>
        <button
          className={"navbar-toggler"}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className={"navbar-toggler-icon"}></span>
        </button>
        <div className={"collapse navbar-collapse"} id="navbarNav" >
          <ul className="navbar-nav">
            <li className={"nav-item"} >
              
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
