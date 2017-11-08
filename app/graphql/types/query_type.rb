include DaylightEventsHelper

Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :links, types[Types::LinkType] do
    resolve ->(obj, args, ctx) {
      Link.order(:position).all
    }
  end

  field :daylightEvents, types[Types::DaylightEventType] do
    argument :days, types.Int, default_value: 3

    resolve ->(obj, args, ctx) {
      daylight_events(args[:days])
    }
  end
end
