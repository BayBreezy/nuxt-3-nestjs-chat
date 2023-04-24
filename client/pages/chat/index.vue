<template>
  <div>
    <Sidebar
      :logout="logout"
      :chatId="chatId"
      :name="name"
      :users="users"
      :setUser="setUser" />
    <main class="ml-72 min-h-screen">
      <div class="mx-auto max-w-6xl">
        <header
          v-if="selectedUser"
          class="flex h-16 w-full items-center justify-between border-b p-5">
          <span class="font-semibold">
            {{ selectedUser.name }}
          </span>
          <button @click="selectedUser = undefined">Close</button>
        </header>
        <div v-if="selectedUser" class="flex h-[calc(100vh-64px)] w-full flex-col">
          <div class="grow space-y-2 overflow-y-auto p-5">
            <template v-for="m in messages">
              <div
                class="max-w-[80%] rounded-lg p-3"
                :class="[m.sender == chatId ? 'ml-auto bg-gray-300/20' : '']">
                <div>
                  <p class="text-sm">
                    {{ m.message }}
                  </p>
                  <p class="mt-2 text-xs text-gray-400">
                    {{ dayjs(m.date).format("MMM DD, YYYY @ h:mm A") }}
                  </p>
                </div>
              </div>
            </template>
          </div>
          <form
            @submit.prevent="sendMessage"
            class="flex h-16 w-full shrink-0 items-center gap-3 bg-white px-3">
            <input
              type="text"
              v-model="newMessage"
              class="input"
              name="message"
              id="message"
              :placeholder="`Send a message to ${selectedUser.name}...`" />
            <button class="btn btn-primary shrink-0">Send</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import dayjs from "dayjs";
  import { v4 as uuidv4 } from "uuid";

  const name = ref<string | undefined>();
  const chatId = ref<string | undefined>();
  const users = ref<IUser[]>([]);
  const messages = ref<IMessage[]>([]);
  const selectedUser = ref<IUser | undefined>();
  const newMessage = ref("");
  const { $socket } = useNuxtApp();

  const logout = async () => {
    // disconnect from server
    $socket.disconnect();
    await navigateTo("/", { replace: true });
    // clear local storage
    localStorage.removeItem(CHAT_NAME_KEY);
  };

  const setUser = (u: IUser) => {
    selectedUser.value = u;
    $socket.emit(
      "request-messages",
      { recipient: u.chatId, sender: chatId.value },
      (msgs: any[]) => {
        messages.value = msgs || [];
      }
    );
  };

  const sendMessage = () => {
    if (!newMessage.value.trim()) return;
    // create and send message
    const msg = {
      id: uuidv4(),
      sender: chatId.value!,
      recipient: selectedUser.value?.chatId!,
      message: newMessage.value,
      date: new Date(),
    } satisfies IMessage;

    $socket.emit("new message", msg);
    messages.value.push(msg);
    // clear input
    newMessage.value = "";
  };
  onMounted(async () => {
    // show name
    name.value = localStorage?.getItem(CHAT_NAME_KEY) || "";
    chatId.value = localStorage?.getItem(CHAT_ID_KEY) || "";
    // kick user to home page if not name or chatId is detected
    if (!name.value || !chatId.value) {
      await navigateTo("/", { replace: true });
      return;
    }
    // connect to server
    $socket.connect();
    // join with
    $socket.emit("join", { chatId: chatId.value, name: name.value });
    // list for user list
    $socket.on("users", (usersList: IUser[]) => {
      // move logged in user to the top ofthe list
      users.value = usersList.sort((a, b) => {
        return a.chatId == chatId.value ? -1 : 0;
      });
    });

    $socket.on("new message", (msg: IMessage) => {
      if (!selectedUser.value) {
        // add new message flag next to person name in the list
        users.value.forEach((u) => {
          if (u.chatId == msg.sender) {
            u.newMessage = true;
          }
        });
        // state that a new messaeg came in
        const senderName = users.value.find((u) => u.chatId == msg.sender)?.name;
        useToast.success(`New message from ${senderName}`);
        return;
      }
      // check if a message was sent to yourself
      if (selectedUser.value.chatId == chatId.value) return;
      // if the selected user is the sender
      if (selectedUser.value.chatId == msg.sender) {
        messages.value.push(msg);
        return;
      }
    });
  });
</script>
