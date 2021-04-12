import Redis from "ioredis";

const INDEX = "icd-idx";

export class ICD10 {
  async init() {
    this.connection = new Redis({
      port: 11608,
      host: "redis-11608.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: "6eEYrymDcjb6NRCc6Lrunpy50e3vuqko",
    });

    const indices = await this.connection.call("FT._LIST");

    if (indices.includes(INDEX)) {
      await this.connection.call("FT.DROPINDEX", INDEX);
    }

    await this.connection.call(
      "FT.CREATE",
      INDEX,
      "ON",
      "HASH",
      "PREFIX",
      1,
      "icd-10:",
      "SCHEMA",
      "code",
      "TEXT",
      "name",
      "TEXT"
    );
  }

  async findById(id) {
    return await this.connection.hgetall(`icd-10:${id}`);
  }

  async findByCode(query) {
    const [count, ...icd10KeysAndData] = await this.connection.call(
      "FT.SEARCH",
      INDEX,
      `@code:%${query}%`,
      "LIMIT",
      0,
      16
    );

    const icd10Data = icd10KeysAndData.filter((_, index) => index % 2 !== 0);
    const formattedIcd10Data = icd10Data.map((arr) => {
      const keys = arr.filter((_, index) => index % 2 === 0);
      const values = arr.filter((_, index) => index % 2 !== 0);
      return keys.reduce((icd, key, index) => {
        icd[key] = values[index];
        return icd;
      }, {});
    });

    return { count, icd_10: formattedIcd10Data };
  }

  async findByQuery(query) {
    const [count, ...icd10KeysAndData] = await this.connection.call(
      "FT.SEARCH",
      INDEX,
      `%${query}%`,
      "LIMIT",
      0,
      16
    );

    const icd10Data = icd10KeysAndData.filter((_, index) => index % 2 !== 0);
    const formattedIcd10Data = icd10Data.map((arr) => {
      const keys = arr.filter((_, index) => index % 2 === 0);
      const values = arr.filter((_, index) => index % 2 !== 0);
      return keys.reduce((icd, key, index) => {
        icd[key] = values[index];
        return icd;
      }, {});
    });

    return { count, icd_10: formattedIcd10Data };
  }
}
