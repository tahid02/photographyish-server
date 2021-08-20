const findAllData = async (collectionName) => {
  let services;
  try {
    await collectionName.find({}).toArray((err, data) => {
      console.log({ data });
      services = data;
    });
  } catch (error) {
    console.log({ error });
    services = error;
  }
  return services;
};

const findFilteredData = async (collectionName, query, filterQuery) => {
  try {
    await collectionName.find({ query, filterQuery }).toArray((err, data) => {
      return data;
    });
  } catch (error) {
    return { error };
  }
};

module.exports = { findAllData, findFilteredData };
