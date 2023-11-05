const TEST_ID_HEADER = 'ID/Test'

const createTestID = (label) => (tag) => (`${TEST_ID_HEADER}/${label}/${tag}`);

export default createTestID;