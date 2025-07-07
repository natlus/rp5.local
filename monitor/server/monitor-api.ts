const file = Bun.file(`${process.env.SERVER_BASE_DIR}/temps.txt`);

Bun.serve({
  port: 3010,
  async fetch(req: Request) {
    const data = await file.text();

    console.log();

    const res = Response.json({
      temps: data
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const row = line.split(",");
          return {
            temp: row[0],
            timestamp: row[1],
            unit: row[2],
          };
        }),
    });

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return res;
  },
});
