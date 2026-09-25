// 1. Capture inventory BEFORE the gravestone mod consumes/clears it
EntityEvents.hurt('player', event => {
    let player = event.entity
    let damage = event.amount

    // Check if this incoming damage will be fatal
    if (player.health - damage <= 0) {
        let persistentData = player.persistentData
        let savedItems = []

        // Save every item in the inventory prior to gravestone creation
        player.inventory.items.forEach(itemStack => {
            if (!itemStack.empty) {
                savedItems.push(itemStack.saveNBT())
            }
        })

        // Store NBT data persistently on the player
        persistentData.put('lost_items', savedItems)
    }
})

// 2. Right-click recall scroll to fetch items and clear remote grave state
ItemEvents.rightClicked('kubejs:recall_item', event => {
    let player = event.player
    let persistentData = player.persistentData

    if (persistentData.contains('lost_items')) {
        let savedItems = persistentData.get('lost_items')

        if (savedItems.length > 0) {
            // Restore saved items to player
            savedItems.forEach(nbtItem => {
                let restoredItem = Item.ofNBT(nbtItem)
                player.give(restoredItem)
            })

            // Run server command to restore/clean up GraveStone state if applicable
            event.server.runCommandSilent(`restoreinventory ${player.username}`)

            // Wipe persistent data to prevent item duplication
            persistentData.remove('lost_items')

            // Consume one scroll
            event.item.count--

            // Feedback FX & Message
            player.tell(Text.green('Recalled lost items from your gravestone!'))
            player.level.playSound(null, player.blockPosition(), 'minecraft:block.end_portal.spawn', 'players', 0.8, 1.2)
        } else {
            player.tell(Text.red('No items stored for recall!'))
        }
    } else {
        player.tell(Text.red('No death records found!'))
    }
})
