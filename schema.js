const { default: axios } = require('axios')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList,
	GraphQLSchema,
} = require('graphql')

// Customer Type
const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
	}),
})

// Root Query Type
const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: () => ({
		customer: {
			type: CustomerType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return axios
					.get(`http://localhost:4000/customers/${args.id}`)
					.then(res => res.data)
			},
		},
		customers: {
			type: new GraphQLList(CustomerType),
			resolve(parent, args) {
				return axios
					.get(`http://localhost:4000/customers`)
					.then(res => res.data)
			},
		},
	}),
})

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addCustomer: {
			type: CustomerType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				email: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				return axios
					.post('http://localhost:4000/customers/', {
						name: args.name,
						age: args.age,
						email: args.email,
					})
					.then(res => res.data)
			},
		},
		editCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
				email: { type: GraphQLString },
			},
			resolve(parent, args) {
				return axios
					.patch(`http://localhost:4000/customers/${args.id}`, args)
					.then(res => res.data)
			},
		},
		deleteCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				return axios
					.delete(`http://localhost:4000/customers/${args.id}`)
					.then(res => res.data)
			},
		},
	}),
})

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: mutation,
})

module.exports = schema
