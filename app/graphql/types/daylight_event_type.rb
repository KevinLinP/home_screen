Types::DaylightEventType = GraphQL::ObjectType.define do
  name 'DaylightEvent'

  field :type, !types.String
  field :timestamp, !types.Int
end
