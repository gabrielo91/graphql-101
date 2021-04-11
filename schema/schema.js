const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} = graphql;

const HOST_NAME = "http://localhost:3000";

const resolveUser = (id) => {
  return axios.get(`${HOST_NAME}/users/${id}`).then(({ data }) => data);
};
const resolveCompany = (id) => {
  return axios.get(`${HOST_NAME}/companies/${id}`).then(({ data }) => data);
};
const resolveUsersPerCompany = (id) => {
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
      resolve: (parentValue) => resolveUsersPerCompany(parentValue.id),
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
      resolve: (parentValue) => resolveCompany(parentValue.id),
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
      resolve: (_, args) => resolveUser(args.id),
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_, args) => resolveCompany(args.id),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
