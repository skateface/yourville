const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addFilter("dump", (obj) => JSON.stringify(obj));
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addFilter("findArchetype", (archetypes, slug) =>
    (archetypes || []).find((a) => a.slug === slug)
  );
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addCollection("guides", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/guides/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    )
  );

  eleventyConfig.addCollection("journal", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/journal/*.md").sort(
      (a, b) => b.date - a.date
    )
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
