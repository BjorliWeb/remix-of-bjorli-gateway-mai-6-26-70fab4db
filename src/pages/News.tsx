import { useLanguage } from '@/i18n/LanguageContext';
import NewsListingTemplate from '@/components/listing/NewsListingTemplate';
import { toListingItem } from '@/components/listing/listingHelpers';
import { getNews, useCms } from '@/lib/cms';
import heroImg from '@/assets/hero-winter.jpg';

const News = () => {
  const { d, locale } = useLanguage();
  const news = useCms(() => getNews({ language: locale }), [locale]) ?? [];
  const items = news.map((n) => toListingItem(n, heroImg));
  return (
    <NewsListingTemplate
      title={d.listing.pageNewsTitle}
      intro={d.listing.pageNewsIntro}
      heroImage={heroImg}
      basePath="/nyheter"
      items={items}
    />
  );
};

export default News;
