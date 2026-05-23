import { Helmet } from "react-helmet-async";

const SITE_NAME = "Modern Wedding Studios";
const DEFAULT_DESCRIPTION = "Cinematic wedding films, model portfolios, and editorial photography by Arun. Crafting timeless love stories through film.";

function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage,
  type = "website"
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}

export default SEO;
