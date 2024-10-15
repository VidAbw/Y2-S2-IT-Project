const router = require("express").Router();
const { response } = require("express");
let Inventory = require("../models/inventory");

//Create User
router.route("/add").post(async (req, res) => {
    const { ItemName, Quantity, PreOrder, ExpDate, ManDate } = req.body;

    try {
        // Find the most recently added item based on addedTime
        const lastItem = await Inventory.findOne().sort({ addedTime: -1 });

        let newItemCode = "I0001"; // Default for the first item

        if (lastItem) {
            // Extract numeric part of the last ItemCode and increment it
            const lastItemCode = lastItem.ItemCode;
            const codeNumber = parseInt(lastItemCode.substring(1)) + 1;
            newItemCode = 'I' + codeNumber.toString().padStart(4, '0');
        }

        // Create the new inventory item with the generated ItemCode
        const newInventory = new Inventory({
            ItemCode: newItemCode,
            ItemName,
            Quantity,
            PreOrder,
            ExpDate,
            ManDate
        });

        // Save the new inventory item
        await newInventory.save();
        res.json("New Item Created with ItemCode: " + newItemCode);
    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});



//View Users
router.route("/").get((req, res) => {

    Inventory.find().then((inventoris) => {
        res.json(inventoris)
    }).catch((err) => {
        console.log(err)
    })

})

router.route("/update/:id").put(async (req, res) => {
    let userId = req.params.id;
    const {
        ItemCode,
        ItemName,
        Quantity,
        PreOrder,
        ExpDate,
        ManDate,
        
    } = req.body;

    const updateInventory = {
        ItemCode,
        ItemName,
        Quantity,
        PreOrder,
        ExpDate,
        ManDate,
        
    }

    const update = await Inventory.findByIdAndUpdate(userId, updateInventory)
        .then(() => {
            res.status(200).send({ status: "User Updated" })
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        })
})

//Delete User by ID
router.route("/delete/:id").delete(async (req, res) => {
    let userId = req.params.id;

    await Inventory.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).send({ status: "User deleted" });
        }).catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete user", error: err.message })
        })
})

//View user by ID
router.route("/get/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await Inventory.findById(userId)
        .then((admin) => {
            res.status(200).send({ status: "user fetched", admin })
        }).catch(() => {
            console.log(err.message);
            res.status(500).send({ status: "Error with get user", error: err.message })
        })
})

//Search

router.get('/search/:searchInput', async (req, res) => {
    try {
        const { searchInput } = req.params;
        const users = await Inventory.find({
            $or: [
                { ItemName: { $regex: searchInput, $options: 'i' } }, { ItemCode: { $regex: searchInput, $options: 'i' } },
            ],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE all items
router.delete('/delete', async (req, res) => {
    try {
        await Inventory.deleteMany({});
        res.status(200).json({ message: 'All items deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





module.exports = router;