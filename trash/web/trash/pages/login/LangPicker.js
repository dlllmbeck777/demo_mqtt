import { useSelector } from 'react-redux';

import text from './login/text.json'
const LangPicker = () => {
    const lang = useSelector((state) => state.lang.lang);
    switch (lang) {
        case ("English"):
            return text.english
        case ("Русский"):
            return text.Русский
        default:
            return text.english
    }
}

export default LangPicker