// The /vinter route is the proper winter homepage for Bjorli.
// It reuses the rich winter homepage component (the same one that
// was historically mounted at "/") so visitors get the full
// ski-focused landing experience — hero, lift-pass CTA, status
// cards, accommodation, family, planning, etc. — regardless of
// whether the site root is currently themed for summer or winter.
import Index from './Index';
const Vinter = () => <Index />;
export default Vinter;