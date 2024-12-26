import { gql } from "graphql-tag";

export const typeDefs = gql`

    type TestNode {
        id: ID! @id
        name: String
        createdAt: DateTime
        updatedAt: DateTime
    }


  type Mutation {
    createTestNode: String
  }

  type Query {
    _dummy: Boolean
  }
`;
