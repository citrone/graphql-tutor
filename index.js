const { ApolloServer, gql } = require('apollo-server');

const authors = [
    {
        id: "1",
        name: 'Feodor Mihailovici Dostoievski',
        books: ['1']
    },
    {
        id: "2",
        name: 'Marin Preda',
        books: ['2', '4']
    },
    {
        id: "3",
        name: 'Mihai Eminescu',
        books: ['3']
    }
]
const books = [
    {
        id: '1',
        title: 'Demonii',
        authorId: '1'
    },
    {
        id: '2',
        title: 'Morometii',
        authorId: '2'
    },
    {
        id: '3',
        title: 'Poezii',
        authorId: '3'
    },
    {
        id: '4',
        title: 'Viata ca o prada',
        authorId: '2'
    }
]

const typeDefs = gql`
    type Book {
        id: ID!
        title: String
        author: Author
    }

    type Author {
        name: String
        books: [Book]
    }

    type Query {
        books: [Book]
        booksByTitle(title: String!): [Book]
        bookById(id: ID!): Book
        authors: [Author]
        authorsByName(name: String!): [Author]
    }
`

const resolvers = {
    Query: {
        books: () => books,
        booksByTitle: (root, args) => books.filter(book => book.title === args.title),
        bookById: (root, args) => books.filter(book => book.id === args.id)[0],
        authors: () => authors,
        authorsByName: (root, args) => authors.filter(author => author.name === args.name)
    },
    Book: {
        author(parent, args, context, info) {
            return authors.find((author) => author.id === parent.authorId)
        }
    },
    Author: {
        books(parent, args, context, info) {
            let listOfBooks = []
            parent.books.forEach(bookId => {
                listOfBooks.push(books.find(book => book.id === bookId))
            });
            return listOfBooks
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`Server listening at ${url}`))
