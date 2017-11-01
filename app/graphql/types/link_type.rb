Types::LinkType = GraphQL::ObjectType.define do
  name 'Link'

  field :id, !types.ID
  field :position, !types.Int
  field :name, !types.String
  field :url, !types.String
  field :image, !types.String
end
