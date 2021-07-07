
class APIFeatures{
    constructor(query, querystring)
    {
        this.query = query;
        this.querystring = querystring;
    }
    filter()
    {
 // Built Query
        // 1 Filtering
        const queryObj = { ...this.querystring };
        console.log(queryObj)
        const excludedfield = ['sort', 'limit', 'page','fields']
        excludedfield.forEach(el => delete queryObj[el]);
        // 2 advance filtring
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(querystr));
        return this;
    }
    sorts()
    {
        if (this.querystring.sort)
        {
            const sortBy = this.querystring.sort.split(',').join(' ');
            console.log("sort by", sortBy);
            this.query  =  this.query.sort(sortBy);
            }
        else {
            this.query  = this.query.sort('-createdAt')
        }
        return this;
    }
    limitFields()
    {
        if (this.querystring.fields)
        {
            const field = this.querystring.fields.split(',').join(' ');
            this.query = this.query.select(field);
        }
        else {
            this.query  = this.query.select('-__v');     
        }
        return this;
    }
    pagination()
    {
        const page = this.querystring.page *1 || 1;
        const limitOfRecord = this.querystring.limit * 1 || 20;
        const skipRecord = (page - 1) * limitOfRecord;
        this.query = this.query.skip(skipRecord).limit(limitOfRecord);
        return this;
    }
}
module.exports = APIFeatures;