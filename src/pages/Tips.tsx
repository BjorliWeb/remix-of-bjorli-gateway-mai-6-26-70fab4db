import { useLanguage } from '@/i18n/LanguageContext';
import TipsListingTemplate from '@/components/listing/TipsListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getTips, useCms } from '@/lib/cms';
import heroImg from '@/assets/hero-winter.jpg';

const Tips = () => {
  const { d, locale } = useLanguage();
  const tips = useCms(() => getTips({ language: locale }), [locale]) ?? [];
  const items = tips.map((t) => toListingItem(t, heroImg));
  return (
    <TipsListingTemplate
      title={d.listing.pageTipsTitle}
      intro={d.listing.pageTipsIntro}
      heroImage={heroImg}
      basePath="/tips"
      entries={tips}
      items={items}
    />
  );
};

export default Tips;
