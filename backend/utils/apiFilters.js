class ApiFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  //   filters() {
  //     const queryCopy = { ...this.queryStr };

  //     // Fields to remove
  //     const fieldsToRemove = ["keyword", "page"];
  //     fieldsToRemove.forEach((el) => delete queryCopy[el]);

  //     // Advance filter for price, ratings etc
  //     let queryStr = JSON.stringify(queryCopy);
  //     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

  //     console.log("querystr", queryStr);

  //     this.query = this.query.find(JSON.parse(queryStr));
  //     return this;
  //   }

  filters() {
    let queryCopy = { ...this.queryStr };

    // Remove unwanted fields
    const fieldsToRemove = ["keyword", "page", "limit", "sort"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Convert bracket notation: price[$gte] -> price: { $gte: value }
    for (let key in queryCopy) {
      if (key.includes("[")) {
        const base = key.split("[")[0]; // "price"
        const operator = key.match(/\[(.*)\]/)[1]; // "$gte"

        if (!queryCopy[base]) queryCopy[base] = {};
        queryCopy[base][operator] = queryCopy[key];

        delete queryCopy[key];
      }
    }

    // Now: queryCopy = { price: { $gte: "20" } }

    // Stringify and replace gte, gt, lte, lt
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (m) => `$${m}`);

    console.log("queryStr =>", queryStr);

    // Parse safely
    const parsed = JSON.parse(queryStr);

    // Convert numeric strings to numbers
    for (let key in parsed) {
      if (typeof parsed[key] === "object") {
        for (let op in parsed[key]) {
          if (!isNaN(parsed[key][op])) {
            parsed[key][op] = Number(parsed[key][op]);
          }
        }
      }
    }

    this.query = this.query.find(parsed);
    return this;
  }

  pagination(resPerPage) {
    const page = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (page - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
  }
}

export default ApiFilters;
