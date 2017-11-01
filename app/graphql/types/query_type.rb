Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :links, types[Types::LinkType] do
    resolve ->(obj, args, ctx) {
      Link.order(:position).all
    }
  end
end
