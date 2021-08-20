const insertData = async (collectionName, dataToPost) => {
  try {
    await collectionName.insertOne(dataToPost).then((result) => {
      // console.log('inserted count', result.insertedCount);
      return result.insertedCount > 0;
    });
  } catch (error) {
    return { error };
  }
};

module.exports = { insertData };
