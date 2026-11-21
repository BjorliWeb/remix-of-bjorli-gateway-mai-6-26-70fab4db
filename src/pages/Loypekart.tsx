import SubPage from '@/components/SubPage';
import { TrailMapSections } from '@/components/ResortFactsSections';
import { useLanguage } from '@/i18n/LanguageContext';
import { getSkiCenterData } from '@/lib/cms/skiCenterData';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';

const Loypekart = () => {
  const { locale } = useLanguage();
  const { trailMap } = getSkiCenterData(locale);
  return <SubPage slug="loypekart" afterIntro={<TrailMapSections locale={locale}
    alpineImage={loypekartImage} alpineAlt={trailMap.alt}
    openLabel={trailMap.ariaOpen} operationalNote={trailMap.note} />} />;
};
export default Loypekart;