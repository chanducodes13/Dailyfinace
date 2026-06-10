import { useTranslation } from 'react-i18next';
import { INDIAN_LANGUAGES } from '../constants/Languages';
import { useLanguage } from '../context/language-context';

export const useAppLanguage = () => {
    const { t, i18n } = useTranslation();
    const { currentLanguage, changeLanguage } = useLanguage();

    const currentLangDetails = INDIAN_LANGUAGES.find(
        l => l.code === currentLanguage
    );

    return {
        t,
        currentLanguage,
        currentLangDetails,
        changeLanguage,
        languages: INDIAN_LANGUAGES,
    };
};