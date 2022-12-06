using System;
using System.Threading.Tasks;

using Azure.Core;
using Azure.Messaging.WebPubSub;

namespace publisher
{
    class Program
    {
        static async Task Main(string[] args)
        {
            if (args.Length != 3) {
                Console.WriteLine("Usage: publisher <connectionString> <hub> <message>");
                return;
            }
            var connectionString = args[0];
            var hub = args[1];
            var message = args[2];
            
            // Either generate the token or fetch it from server or fetch a temp one from the portal
            var serviceClient = new WebPubSubServiceClient(connectionString, hub, new WebPubSubServiceClientOptions
            {

            });
            Console.ReadKey();
            Task[] tasks = new Task[100];
            //for (int i = 0; i < 100; i++)
            //{
            //    using var response = await serviceClient.SendToUserAsync("testUser", RequestContent.Create("Message"), ContentType.TextPlain)
            //        ;
            //}

            // Task.WaitAll(tasks);

            Console.ReadKey();

            for (int i = 0; i < 100; i++)
            {
                tasks[i] = SendToUser(serviceClient);
            }

            Task.WaitAll(tasks);
            Console.ReadKey();
            GC.Collect();
            Console.ReadKey();
        }

        async static Task SendToUser(WebPubSubServiceClient serviceClient)
        {
            using var content = RequestContent.Create("Message");
            using var response = await serviceClient.SendToUserAsync("testUser", content, ContentType.TextPlain);
        }
    }
}
