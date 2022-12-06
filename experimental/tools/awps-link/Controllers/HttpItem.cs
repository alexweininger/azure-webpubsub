namespace Azure.Messaging.WebPubSub.LocalLink.Controllers
{
    public class HttpItem
    {
        public int Id { get; set; }

        public ulong? TracingId { get; set; }

        public string MethodName { get; set; }

        public string Url { get; set; }

        public string? Error { get; set; }

        public int? Code { get; set; }

        public DateTime RequestAt { get; set; }

        public string RequestRaw { get; set; }

        public DateTime? RespondAt { get; set; }

        public string ResponseRaw { get; set; }
    }
}
