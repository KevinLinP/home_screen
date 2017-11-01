Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createLink, Types::LinkType do
    argument :name, !types.String
    argument :url, !types.String
    argument :image, !types.String

    resolve ->(obj, args, ctx) {
      link = Link.create!({
        name: args[:name],
        url: args[:url],
        image: args[:image]
      })

      link
    }
  end

  field :deleteLink, types.Int do
    argument :id, !types.ID

    resolve ->(obj, args, ctx) {
      Link.find(args[:id]).destroy

      args[:id]
    }
  end

end
