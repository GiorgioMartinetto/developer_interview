
import Home from "./pages/Home.tsx"
import {Routes, Route} from 'react-router-dom'
import Products from "./pages/Products.tsx"
import Contacts from "./pages/Contacts.tsx"
import MyChatBot from "./components/MyChatBot.tsx"

export default function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/products' element={<Products />}/>
                <Route path='/contacts' element={<Contacts />}/>
            </Routes>
            <MyChatBot />
        </>
    )
}
