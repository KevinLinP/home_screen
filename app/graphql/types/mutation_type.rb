Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createLink, types[Types::LinkType] do
    argument :name, !types.String
    argument :url, !types.String
    argument :image, !types.String

    resolve ->(obj, args, ctx) {
      Link.create!({
        name: args[:name],
        url: args[:url],
        image: args[:image]
      })

      Link.order(:position).all
    }
  end

  field :deleteLink, types[Types::LinkType] do
    argument :id, !types.ID

    resolve ->(obj, args, ctx) {
      Link.find(args[:id]).destroy

      Link.order(:position).all
    }
  end

end
