const findAllData = async (collectionName) => {
  try {
    await collectionName.find({}).toArray((err, services) => {
      return services;
    });
  } catch (error) {
    return { error };
  }
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
