import { unstable_dev } from "wrangler";

describe("Newsletter RSS", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstable_dev("index.js", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("check a stale news letter and give a consistent response", async () => {
    // picking a stale newsletter https://www.linkedin.com/newsletters/james-caan-s-business-secrets-6676195873757679616/
    const resp = await worker.fetch(
      "/the-design-spectrum-7084431506013655040"
    );
    const text = await resp.text();
    expect(text).toContain("<title>Prithiv Kumar&apos;s The Design Spectrum</title>");
    expect(text).toContain(
      "<link>https://www.linkedin.com/newsletters/the-design-spectrum-7084431506013655040</link>"
    );
    expect(text).toContain("<description>Answering all your");
    expect(text).toContain("<url>https://media.licdn.com");
    expect(text).toContain(
      "<title>Daily Newsletter</title>"
    );
    expect(text).toContain("<description><![CDATA[<p>");
    expect(text).toContain("<pubDate>");
    expect(text).toContain("<author>Prithiv Kumar</author>");
    expect(text).toContain('<enclosure url="https://media.licdn.com');
  });
});
