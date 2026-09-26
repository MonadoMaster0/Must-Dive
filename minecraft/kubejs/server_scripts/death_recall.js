PlayerEvents.loggedIn(event => {
    const player = event.player;
    const itemStack = player.getInventory().getItem(0); // Get the first item in the inventory
    const nbtData = Item.of(itemStack).getTag(); // Access the NBT data

    if (nbtData) {
        // Perform actions based on the NBT data
        const someValue = nbtData.getString('someKey'); // Example of getting a string value
        // Do something with the value
        console.log(someValue)

    }
});

ItemEvents.rightClicked('kubejs:recall_item', event => {
    const player = event.player
    const server = event.server
    const obituary = 'gravestone:obituary'
  
    const itemStack = player.getInventory().getItem(0); // Get the first item in the inventory
    const nbtData = itemStack// Access the NBT data

    player.tell(itemStack.toNBT())

    // player.inventory.items.forEach(item => {
    //    if (item.id === obituary) {
    //        hasItem = true;
    //    }
    });
  // Runs directly as CONSOLE / SERVER (Full Admin Privileges)
  //server.runCommandSilent(`restore ${player.username} `)
