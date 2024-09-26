# Granular

## Structure

The structure of a Granular application follows this pattern

-   System
    -   Application_A
        -   Functionality
            -   Logic
    -   Application_B
        -   Functionality
            -   Logic

### System

```ts
import { System } from '@granular/system'

new System().start().then(...)
```

The system manages applications. Applications may be added in the following way:

```ts
new System().withApplications([MyApp]).start();
```

### Application

Applications are created by implementing a special interface from `@granular/system` and marking them as injectable

```ts
import { IApplication, injectable } from '@granular/system';

@injectable()
class MyApp implements IApplication {}
```

You can specify the startup sequence of applications by giving them a priority. This is useful if you want to start applications in a sequence. The higher of a priority an application has, the earlier it will start with respect to the other application priorities. If no priority is given, the default 0.

```ts
@injectable()
@WithStartupPriority(0)
class MyApp implements IApplication {}
```

You can also give your application an identifier which will help for debugging

```ts
@injectable()
@WithIdentifier('MyApplication')
class MyApp implements IApplication {}
```

To make your application actually do something, you want to populate it with functionality.

### Functionality

Each application is made up of a set of funtionalities. `@granular` exists to re-use already existing functionality but also to create your own.

#### Creating a custom functionality

Start by importing the IFunctionality interface from `@granular/system`

```ts
import { IFunctionality } from '@granular/system';
```

The interface has 3 generic parameters.

-   ExtendableLogic
    -   Internal logic interfaces that may be extended
-   LogicIdentifiers
    -   Identifiers to the above.
-   Configuration
    -   Configuration of this functionality

```ts
IFunctionality<ExtendableLogic, LogicIdentifiers, Configuration>;
```

Next create a class that implements this interface and mark it as injectable. As an example, let´s create a functionality for event handling. First declare an interface for your event handlers.

```ts
interface IEventHandler {
    // called when an event is received
    onEvent(message: string): void;
    // the type of event this handler should listen to
    getType(): string;
}
```

Next, create your publicly extendable logics. In this case, we only want to be able to add event handlers so this interface will be the only logic extension.

```ts
type ExtendableLogic = IEventHandler;
```

Next define your public logic identifiers.

```ts
enum MyFunctionalityIdentifiers {
    EVENT_HANDLER = 'IEventHandler',
}
```

If your functionality may be configured, declare an interface for the configuration also

```ts
interface IConfiguration {
    foo: string;
}
```

Finally we want to create a separate interface that will be used to consume all event handlers and to start actually listening to events

```ts
interface IEventManager {
    start(): void;
}
```

Now that all of our types and interfaces have been declared, let´s piece the logic together. Let´s create a class that implements the IFunctionality interface.

```ts
@injectable()
class EventFunctionality
    implements
        IFunctionality<
            ExtendableLogic,
            MyFunctionalityIdentifiers,
            IConfiguration
        >
{
    // Receives any extensions, it is up to each functionality to handle this.
    onLogicExtensions(
        extensions: ILogicExtension<
            ExtendableLogic,
            MyFunctionalityIdentifiers,
            IConfiguration
        >[],
        container: Container
    ): void {}

    // Called with the configuration given to this functionality
    onConfigure(configuration: IConfiguration): void {}

    // Called when it is time for this functionality to bind its´ internal dependencies.
    bindInternals(container: Container): void {}

    // This will be called when all of the above has been resolved
    async start(container: Container): Promise<void> {}
}
```

Lets start by implementing some logic in these methods. Lets begin with onLogicExtensions

```ts
onLogicExtensions(
        extensions: ILogicExtension<ExtendableLogic, MyFunctionalityIdentifiers, IConfiguration>[],
        container: Container
    ): void {
        // we loop through each possible extension even though we only have one in this case, the IEventHandler
        extensions.forEach((extension) => {
            // We use the identifier to verify the type of extension
            if (extension.identifier === MyFunctionalityIdentifiers.EVENT_HANDLER) {
                // And finally we go thorugh all the IEventHandlers and bind them to the di container
                extension.definitions.forEach((definition) => {
                    container
                        .bind(extension.identifier)
                        .to(definition)
                        .inSingletonScope()
                })
            }
        })
    }
```

Before we implement the `bindInternals` method, we need to implement the IEventManager since `bindInternals` will use this dependency. So let´s to that.

```ts
@injectable()
class EventManager implements IEventManager {
    constructor(
        // Inject all event handlers
        @multiInject(MyFunctionalityIdentifiers.EVENT_HANDLER)
        // The number of event handlers could be 0, meaning we declare this as optional
        @optional()
        private eventHandlers: IEventHandler[]
    ) {}

    start() {
        // Go through each injected event handler
        this.eventHandlers.forEach((eventHandler) => {
            // Bind the handler to the emitter
            EventEmitter.on(eventHandler.getType(), eventHandler.onEvent);
        });
    }
}
```

Now we can finally implement the `bindInternals` method

```ts
bindInternals(container: Container): void {
        container.bind<IEventManager>('IEventManager').to(EventManager).inSingletonScope()
    }
```

And lastly, let´s implement the `start` method

```ts
async start(container: Container): Promise<void> {
    container.get<IEventManager>('IEventManager').start()
}
```

Let´s use this functionality in an application now. First we need to create an event handler

```ts
@injectable()
class MyEventHandler implements IEventHandler {
    onEvent(message: string): void {
        console.log('Message received', message);
    }

    getType(): string {
        return 'message';
    }
}
```

In order to add this to an application, there is a decorator available from the `@granular/system` that we can use

```ts
import { WithFunctionality } from '@granular/system';

@injectable()
@WithFunctionality({
    functionality: EventFunctionality,
    extend: [
        {
            identifier: MyFunctionalityIdentifiers.EVENT_HANDLER,
            definitions: [MyEventHandler],
        },
    ],
})
class MyApp implements IApplication {}
```

And that´s it. When the System starts, this functionality will automatically run and starts listening to 'message' events.

## Existing functionalities

This will be a growing eco-system of functionalities. Developers may implement their own functionality packages and this repository will also continue to grow with new functionalties
