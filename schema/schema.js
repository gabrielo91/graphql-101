const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = graphql;

const HOST_NAME = "http://localhost:3000";

const getUserResolver = (id) => {
  return axios.get(`${HOST_NAME}/users/${id}`).then(({ data }) => data);
};

const addUserResolver = ({ firstName, age }) => {
  return axios
    .post(`${HOST_NAME}/users`, {
      firstName,
      age,
    })
    .then(({ data }) => data);
};

const deleteUserResolver = (id) => {
  return axios.delete(`${HOST_NAME}/users/${id}`).then(({ data }) => data);
};

const getCompanyResolver = (id) => {
  return axios.get(`${HOST_NAME}/companies/${id}`).then(({ data }) => data);
};
const getUsersPerCompanyResolver = (id) => {
  return axios
    .get(`${HOST_NAME}/companies/${id}/users`)
    .then(({ data }) => data);
};

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve: (parentValue) => getUsersPerCompanyResolver(parentValue.id),
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve: (parentValue) => getCompanyResolver(parentValue.id),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_, args) => getUserResolver(args.id),
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_, args) => getCompanyResolver(args.id),
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve: (_, args) => addUserResolver(args),
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => deleteUserResolver(args.id),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
