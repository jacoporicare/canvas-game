export type Handler<TModel, TEvent extends Event> = (
  model: TModel,
  event: TEvent
) => TModel;
export type Handle<TModel> = <TEvent extends Event>(
  element: EventTarget,
  type: string,
  handler: Handler<TModel, TEvent>
) => void;
export type Init<TModel> = (handle: Handle<TModel>) => TModel;
export type Update<TModel> = (dt: number, model: TModel) => TModel;
export type Render<TModel> = (model: TModel) => void;

export function engine<TModel>(
  init: Init<TModel>,
  update: Update<TModel>,
  render: Render<TModel>
) {
  let prevTs = 0;
  let model: TModel;

  function handle<TEvent extends Event>(
    element: EventTarget,
    type: string,
    handler: Handler<TModel, TEvent>
  ) {
    element.addEventListener(type, (event: Event) => {
      model = handler(model, event as TEvent);
    });
  }

  model = init(handle);

  function loop(ts: number) {
    const dt = ts - prevTs;
    prevTs = ts;

    model = Object.assign({}, model, update(dt, model));

    render(model);

    window.requestAnimationFrame(loop);
  }

  loop(0);
}
