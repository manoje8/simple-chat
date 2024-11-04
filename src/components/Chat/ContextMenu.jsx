import { useEffect, useRef } from "react"
import "./ContextMenu.css";

const ContextMenu = ({showMenu, handleMenu, handleDelete}) => {
    const menuRef = useRef()

    // Close the menu when user click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
              handleMenu();
            }
        }
      
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
      
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[showMenu, handleMenu])

    return (
        <div className={showMenu ? "context-menu" : 'hidden'}>
            <ul ref={menuRef}>
                <li className="context-menu-list" onClick={handleDelete}>
                    <i class="bi bi-trash-fill"></i>
                    <span>Delete</span>
                </li>
                <li className="context-menu-list">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>Info</span>
                </li>
            </ul>
        </div>
    )
}

export default ContextMenu